using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections;

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
  public static class MongoData
  {
    private static readonly IMongoDatabase? _groups;

    static MongoData()
    {
      var mongoClient = new MongoClient("mongodb://localhost:27017");

      _groups = mongoClient.GetDatabase("ChatApplication");
    }

    public static async Task<List<Group>> GetAllMessages(string collectionName) =>
      await _groups!.GetCollection<Group>(collectionName).Find(_ => true).ToListAsync();

    public static async Task AddMessageToDb(Group message, string collectionName){
      await _groups!.GetCollection<Group>(collectionName).InsertOneAsync(message);
    }

    public static async Task<List<string>> GetAllCollectionData() =>
        await _groups!.ListCollectionNames().ToListAsync();

    public static async Task CreateNewCollection(Group newGroup, string collectionName) =>
        await _groups!.GetCollection<Group>(collectionName).InsertOneAsync(newGroup);

    public static void ChangeStreamFunction()
    {

      Console.WriteLine("Entered...");

      var pipeline = new EmptyPipelineDefinition<ChangeStreamDocument<Group>>();

      var changeStreamOptions = new ChangeStreamOptions
      {
        FullDocument = ChangeStreamFullDocumentOption.UpdateLookup
      };

      using (var cursor = _groups!.GetCollection<Group>("WHI-GBD").Watch(pipeline, changeStreamOptions))
      {
        foreach (var change in cursor.ToEnumerable())
        {
          if(change.OperationType == ChangeStreamOperationType.Insert)
          {
            Console.WriteLine(change.FullDocument.ToJson());
          };
        }
      }

      Console.WriteLine("Press any key to exit...");
    }
  }
}
