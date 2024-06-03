using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using MongoDB.Driver;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace MongoDLL
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

    public class InsertChangeStream : Hub
    {
        public async Task ChangeStreamFunction(IMongoDatabase _groups)
        {
            Console.WriteLine("Entered...");

            var pipeline = new EmptyPipelineDefinition<ChangeStreamDocument<Group>>().Match(x => x.OperationType == ChangeStreamOperationType.Insert);

            var changeStreamOptions = new ChangeStreamOptions
            {
                FullDocument = ChangeStreamFullDocumentOption.UpdateLookup
            };

            using (var cursor = await _groups.GetCollection<Group>("WHI-GBD").WatchAsync(pipeline, changeStreamOptions))
            {
                await foreach (var change in cursor.ToAsyncEnumerable())
                {
                    if (change.FullDocument != null)
                    {
                        Console.WriteLine(change.FullDocument.ToJson());
                        Group _group = new(change.FullDocument.ImageUrl!, change.FullDocument.UserName!, change.FullDocument.Message!, DateTime.Now);
                        //await Clients.Group("WHI-GBD").SendAsync("AllMessages", _group.UserName, _group.Message, _group.ImageUrl, DateTime.Now);
                    }
                    else
                    {
                        Console.WriteLine("Document is null");
                    }
                }
            }

            Console.WriteLine("Press any key to exit...");
        }
    }

    public static class MongoData
    {
        private static readonly IMongoDatabase _groups;

        static MongoData()
        {
            var mongoClient = new MongoClient("mongodb://localhost:27017");
            _groups = mongoClient.GetDatabase("ChatApplication");

            // Start the ChangeStreamFunction in a separate task
            Task.Run(async () => {
                var changeStream = new InsertChangeStream();
                await changeStream.ChangeStreamFunction(_groups);
            }).ConfigureAwait(false);
        }

        public static async Task<List<Group>> GetAllMessages(string collectionName) =>
            await _groups.GetCollection<Group>(collectionName).Find(_ => true).ToListAsync();

        public static async Task AddMessageToDb(Group message, string collectionName) =>
            await _groups.GetCollection<Group>(collectionName).InsertOneAsync(message);

        public static async Task<List<string>> GetAllCollectionData() =>
            await _groups.ListCollectionNames().ToListAsync();

        public static async Task CreateNewCollection(Group newGroup, string collectionName) =>
            await _groups.GetCollection<Group>(collectionName).InsertOneAsync(newGroup);
    }
}
