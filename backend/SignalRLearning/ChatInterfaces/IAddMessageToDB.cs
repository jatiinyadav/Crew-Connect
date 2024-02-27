using Microsoft.AspNetCore.SignalR;

namespace SignalRLearning.ChatInterfaces
{
  public interface IAddMessageToDB
  {
    public Task AddMessageToDB(IHubCallerClients clients, string connectionId, UserMessage userMessage);
  }
}
