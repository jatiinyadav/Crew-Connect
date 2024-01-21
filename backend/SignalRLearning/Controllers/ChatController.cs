using Microsoft.AspNetCore.Mvc;
using SignalRLearning.ChatInterfaces;
using SignalRLearning.Services;

namespace SignalRLearning.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;
        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }

        //[HttpPost("register-user")]
        //public IActionResult RegisterUser(UserDetails user)
        //{
        //    if (_chatService.AddUsersToDictionary(user.Name!))
        //    {
        //        return NoContent();
        //    }
        //    return BadRequest("This name is taken please choose another name");
        //}
    }
}
