using System;
using System.Collections.Generic;
using Domain;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Persistance;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _dataContext;
            public Handler(DataContext dataContext)
            {
                _dataContext = dataContext;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                 _dataContext.Activities.Add(request.Activity);
                 await  _dataContext.SaveChangesAsync(cancellationToken);
                 return Unit.Value;
            }
        }
    }
}