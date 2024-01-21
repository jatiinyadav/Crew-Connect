using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using SignalRLearning.ChatInterfaces;

namespace SignalRLearning.Services
{
    public class GroupsService
    {
        private readonly IMongoDatabase? _groups;

        public GroupsService(IOptions<DatabaseConnection> options)
        {
            var mongoClient = new MongoClient(options.Value.ConnectionString);

            _groups = mongoClient.GetDatabase(options.Value.DatabaseName);
        }

        public async Task<List<Group>> GetAllMessages(string collectionName) =>
            await _groups!.GetCollection<Group>(collectionName).Find(_ => true).ToListAsync();

        public async Task AddMessageToDb(Group message, string collectionName) =>
            await _groups!.GetCollection<Group>(collectionName).InsertOneAsync(message);

        public async Task<List<string>> GetAllCollectionData() =>
            await _groups!.ListCollectionNames().ToListAsync();

        public async Task CreateNewCollection(Group newGroup, string collectionName) =>
            await _groups!.GetCollection<Group>(collectionName).InsertOneAsync(newGroup);

    }
}
