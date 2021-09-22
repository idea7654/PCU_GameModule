using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using Newtonsoft.Json;

namespace UnityNetworkLib
{ 
    public class NetworkLib
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
}
