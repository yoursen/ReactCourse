using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using MediatR.Wrappers;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private DataContext _dataContext;
            private IPhotoAccessor _photoAccessor;
            private IUserAccessor _userAccessor;
            public Handler(DataContext dataContext,
                IPhotoAccessor photoAccessor,
                IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _photoAccessor = photoAccessor;
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

                if (photo.IsMain) return Result<Unit>.Failure("Cannot detele main photo");

                var photoDeleteResult = await _photoAccessor.DeletePhoto(request.Id);
                if (photoDeleteResult == null) return Result<Unit>.Failure("Problem deleting photo from claudinary");

                user.Photos.Remove(photo);

                var result = await _dataContext.SaveChangesAsync();

                return result > 0 ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Cannot delete photo");
            }
        }
    }
}