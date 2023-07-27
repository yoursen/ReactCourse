using System;
using System.Collections.Generic;
using Domain;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Persistance;
using FluentValidation;
using Application.Core;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
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
                _dataContext.Activities.Add(request.Activity);
                var result = await _dataContext.SaveChangesAsync();
                if(result <= 0) return Result<Unit>.Failure("Failed to create activity");   

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}