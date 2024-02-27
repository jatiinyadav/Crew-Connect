using Microsoft.AspNetCore.SignalR;
using SignalRLearning.ChatInterfaces;
using SignalRLearning.Services;

namespace SignalRLearning.Models.Interfaces
{
  public interface IUserJoinedGroup
  {
    public Task UserJoinedGroup(IGroupManager groups, IHubCallerClients clients, string connectionId, UserDetails userDetails, UserMessage userMessage);
  }
}
