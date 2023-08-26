using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistance;
using Microsoft.EntityFrameworkCore;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Application.Interfaces;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<ActivityDto>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _dataContext = dataContext;
                _mapper = mapper;
            }

            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new { currentUserName = _userAccessor.GetUserName() })
                    .FirstOrDefaultAsync(x => x.Id == request.Id);
                return Result<ActivityDto>.Success(activity);
            }
        }
    }
}