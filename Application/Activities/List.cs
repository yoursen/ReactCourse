using System;
using System.Collections.Generic;
using Domain;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Persistance;
using Microsoft.EntityFrameworkCore;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Application.Interfaces;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>>
        {

        }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _dataContext = context;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activities = await _dataContext.Activities
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new { currentUserName = _userAccessor.GetUserName() })
                    .ToListAsync(cancellationToken);

                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}