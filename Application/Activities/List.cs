using System;
using System.Collections.Generic;
using Domain;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Persistance;
using Microsoft.EntityFrameworkCore;
using Application.Core;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<Activity>>>
        {

        }

        public class Handler : IRequestHandler<Query, Result<List<Activity>>>
        {
            private readonly DataContext _dataContext;

            public Handler(DataContext context)
            {
                _dataContext = context;
            }

            public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
            {
                return Result<List<Activity>>.Success( await _dataContext.Activities.ToListAsync(cancellationToken));
            }
        }
    }
}