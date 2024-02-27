using Microsoft.AspNetCore.SignalR;
using SignalRLearning.ChatInterfaces;

namespace SignalRLearning.Models.Interfaces
{
  public interface IAddMessageToDB
  {
    public Task AddMessageToDB(IHubCallerClients clients, string connectionId, UserMessage userMessage);
  }
}
