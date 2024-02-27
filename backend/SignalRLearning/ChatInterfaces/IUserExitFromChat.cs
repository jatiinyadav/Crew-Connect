using Microsoft.AspNetCore.SignalR;

namespace SignalRLearning.ChatInterfaces
{
  public interface IUserExitFromChat
  {
    public void UserExitFromChat(IHubCallerClients clients, string connectionId, Exception? exception);
  }
}
