using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private DataContext _dataContext;
            private IUserAccessor _userAccessor;
            public Handler(DataContext dataContext,
                IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users
                    .Include(p => p.Photos)
                    .FirstOrDefaultAsync(p => p.UserName == _userAccessor.GetUserName());

                if (user == null) return null;

                var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);
                if (photo == null) return null;

                if (photo.IsMain) return Result<Unit>.Success(Unit.Value);

                foreach (var p in user.Photos)
                    p.IsMain = false;

                photo.IsMain = true;

                var result = await _dataContext.SaveChangesAsync();

                return result > 0 ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Cannot set photo as main");
            }
        }
    }
}