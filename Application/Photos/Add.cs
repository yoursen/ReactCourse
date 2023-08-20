using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistance;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
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

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _dataContext.Users
                    .Include(p => p.Photos)
                    .FirstOrDefaultAsync(p => p.UserName == _userAccessor.GetUserName());

                if (user == null) return null;

                var photoUploadResult = await _photoAccessor.AddPhoto(request.File);

                var photo = new Photo
                {
                    Id = photoUploadResult.PublicId,
                    Url = photoUploadResult.Url,
                };

                if (!user.Photos.Any(p => p.IsMain))
                    photo.IsMain = true;

                user.Photos.Add(photo);
                var result = await _dataContext.SaveChangesAsync();

                return result > 0 ? Result<Photo>.Success(photo) : Result<Photo>.Failure("Cannot add photo");
            }
        }
    }
}