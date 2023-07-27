using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Persistance;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            public Handler(DataContext dataContext)
            {
                _dataContext = dataContext;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities.FindAsync(request.Id);
                if (activity == null) return null;

                _dataContext.Activities.Remove(activity);
                var result = await _dataContext.SaveChangesAsync();
                if (result <= 0) return Result<Unit>.Failure("Cannot delete activity");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}