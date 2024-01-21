using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace SignalRLearning.ChatInterfaces
{
    public class Group
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }
        public string? ImageUrl { get; set; }
        public string? UserName { get; set; }
        public string? Message { get; set; }
        public DateTime SendOn { get; set; }

        public Group(string img, string username, string message, DateTime sendon)
        {
            ImageUrl = img;
            UserName = username;
            Message = message;
            SendOn = sendon;
        }

    }
}
