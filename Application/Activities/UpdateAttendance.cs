using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;

            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                    .Include(activity => activity.Attendees)
                    .ThenInclude(u => u.AppUser)
                    .SingleOrDefaultAsync(u => u.Id == request.Id);

                if (activity == null)
                    return null;

                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());
                if (user == null) return null;

                var hostUserName = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;
                var attendence = activity.Attendees.FirstOrDefault(a => a.AppUser.UserName == hostUserName);
                if (attendence != null && hostUserName != null)
                    activity.IsCancelled = !activity.IsCancelled;

                if (attendence != null && hostUserName != user.UserName)
                    activity.Attendees.Remove(attendence);

                if (attendence == null)
                {
                    attendence = new Domain.ActivityAttendee()
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };
                    activity.Attendees.Add(attendence);
                }

                var result = await _context.SaveChangesAsync();
                if (result > 0)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem updating attendence");
            }
        }
    }
}