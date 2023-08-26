using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUserName { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _accessor;
            public Handler(DataContext context, IUserAccessor accessor)
            {
                _accessor = accessor;
                _context = context;

            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _accessor.GetUserName());
                if (observer == null) return null;

                var target = await _context.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUserName);
                if (target == null) return null;

                var following = await _context.UserFollowings.FindAsync(observer.Id, target.Id);
                if (following == null)
                {
                    following = new Domain.UserFollowing()
                    {
                        Observer = observer,
                        Target = target,
                    };
                    _context.UserFollowings.Add(following);
                }
                else
                {
                    _context.UserFollowings.Remove(following);
                }

                var success = await _context.SaveChangesAsync() > 0;
                return success ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Cannot change following state");
            }
        }
    }
}