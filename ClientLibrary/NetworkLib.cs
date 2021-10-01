using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using Newtonsoft.Json;
using System.Threading;
using System.IO;
using System.Net.Sockets;

namespace UnityNetworkLib
{
    public class RankingLib
    {
        private struct RankingInfoSend
        {
            public string gameName;
            public string userName;
            public int score;
        }

        public struct userInfo
        {
            public string userName;
            public int score;
        }

        public struct RankingInfoRecv
        {
            private string gameName;
            public userInfo[] data;
        }

        private string url;
        private WebClient wb;

        public NetworkLib()
        {
            url = "https://gamedata.pcu.ac.kr:8600/";
            wb = new WebClient();
        }

        public string GetRanking()
        {
            return "asdf";
        }

        public string EditRanking(string gameName, string userName, int score)
        {
            wb.Headers[HttpRequestHeader.ContentType] = "application/json";
            RankingInfoSend data = new RankingInfoSend();
            data.gameName = gameName;
            data.userName = userName;
            data.score = score;
            var dataString = JsonConvert.SerializeObject(data);
            string response = wb.UploadString(url, "POST", dataString);
            return response;
        }
    }

    public class LoginLib
    {
        private string url;
        private WebClient wb;

        private int port = 8605;
        private Socket socket;
        private IPAddress serverIP;
        private IPEndPoint serverInfo;

        #region TCP_SET
        private bool useTCP = false;
        private byte[] recvByte = new byte[1024];
        private Thread TcpThread;
        private Queue<RecvPacket> Buffer = new Queue<RecvPacket>();
        private object buffer_lock = new object();
        #endregion

        public AutoResetEvent loginEvent = new AutoResetEvent(false);

        public class LoginSend
        {
            public string email;
            public string password;
            public string gameName;
        }

        private class RegisterSend : LoginSend
        {
            public string nickname;
        }

        public class RecvPacket
        {
            public string Message;
            public string nickname;
        }


        LoginLib(bool useSession)
        {
            if (useSession)
            {
                socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
                serverIP = IPAddress.Parse("203.250.133.9");
                serverInfo = new IPEndPoint(serverIP, port);
                useTCP = true;
                try
                {
                    socket.Connect(serverInfo);
                    TcpThread = new Thread(RecvThread);
                }
                catch (SocketException ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }
            url = "https://gamedata.pcu.ac.kr:8605/";
            wb = new WebClient();
        }

        public bool RequestRegister(string gameName, string email, string password, string nickname)
        {
            wb.Headers[HttpRequestHeader.ContentType] = "application/json";
            RegisterSend register = new RegisterSend();
            register.email = email;
            register.nickname = nickname;
            register.password = password;
            register.gameName = gameName;
            var dataString = JsonConvert.SerializeObject(register);
            string response = wb.UploadString(url + "register", "POST", dataString);
            if (response == "true")
                return true;
            else
                return false;
        }

        public string RequestLogin(string gameName, string email, string password)
        {
            LoginSend login = new LoginSend();
            login.gameName = gameName;
            login.email = email;
            login.password = password;
            var dataString = JsonConvert.SerializeObject(login);
            if (useTCP)
            {
                byte[] buff = Encoding.UTF8.GetBytes(dataString);
                socket.Send(buff, SocketFlags.None);
                loginEvent.WaitOne();
                RecvPacket packet;
                lock (buffer_lock)
                {
                    packet = Buffer.Dequeue();
                }
                if (packet.Message == "LoginSuccess")
                    return packet.nickname;
                else
                    return "Error";
            }
            else
            {
                string response = wb.UploadString(url + "login", "POST", dataString);
                return response;
            }
        }

        public void RecvThread()
        {
            NetworkStream stream = new NetworkStream(socket);
            StreamReader reader = new StreamReader(stream);
            while (true)
            {
                int resLength = socket.Receive(recvByte);
                if (resLength > 0)
                {
                    string data = Encoding.UTF8.GetString(recvByte, 0, resLength);
                    RecvPacket packet = JsonConvert.DeserializeObject<RecvPacket>(data);
                    //역직렬화

                    if (packet.Message == "LoginSuccess" || packet.Message == "LoginError")
                    {
                        lock (buffer_lock)
                        {
                            Buffer.Enqueue(packet);
                        }
                        loginEvent.Set();
                    }
                    if (packet.Message == "SessionQuit")
                        SessionQuit(packet.nickname);
                }
            }
        }

        public virtual void SessionQuit(string nickname)
        {

        }
    }
}
