using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Infrastructure.Security
{
    public class IsHostRequirement : IAuthorizationRequirement
    {

    }

    public class IsHostRequirementsHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext _dataContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public IsHostRequirementsHandler(DataContext dataContext,
            IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _dataContext = dataContext;

        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext authorizationHandlerContext,
             IsHostRequirement requirement)
        {
            var userId = authorizationHandlerContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Task.CompletedTask;

            //get activity id from route parameters
            var activityId = Guid.Parse(_httpContextAccessor.HttpContext?.Request.RouteValues
                 .SingleOrDefault(x => x.Key == "id").Value?.ToString());

            var attendee = _dataContext.ActivityAttendees
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.AppUserId == userId && x.ActivityId == activityId)
                .Result;
            if (attendee == null) return Task.CompletedTask;

            if (attendee.IsHost) authorizationHandlerContext.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}