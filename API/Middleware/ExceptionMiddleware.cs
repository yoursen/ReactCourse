using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Core;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private RequestDelegate Next { get; }
        private ILogger<ExceptionMiddleware> Logger { get; }
        private IHostEnvironment Env { get; }
        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            Env = env;
            Logger = logger;
            Next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await Next(context);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                var response = Env.IsDevelopment() ?
                 new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString()) :
                 new AppException(context.Response.StatusCode, "Internal Server Error" );

                 var options = new JsonSerializerOptions(){PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
                 var json = JsonSerializer.Serialize(response, options);
                 await context.Response.WriteAsync(json);
            }
        }
    }
}