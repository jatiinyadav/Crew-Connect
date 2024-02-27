using Microsoft.AspNetCore.SignalR;
using SignalRLearning.Services;

namespace SignalRLearning.ChatInterfaces
{
  public interface IUserJoinedGroup
  {
    public Task UserJoinedGroup(IGroupManager groups, IHubCallerClients clients, string connectionId, UserDetails userDetails, UserMessage userMessage);
  }
}
