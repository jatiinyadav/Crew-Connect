using Microsoft.AspNetCore.SignalR;

namespace SignalRLearning.Models.Interfaces
{
  public interface IUserExitFromChat
  {
    public void UserExitFromChat(IHubCallerClients clients, string connectionId, Exception? exception);
  }
}
