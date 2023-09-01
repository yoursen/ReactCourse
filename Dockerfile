FROM mcr.microsoft.com/dotnet/sdk:7.0 as build-env
WORKDIR /app

#copy .csproj and restore as distinct layer
COPY "code.sln" "code.sln"
COPY "API/API.csproj" "API/API.csproj"
COPY "Application/Application.csproj" "Application/Application.csproj"
COPY "Persistance/Persistance.csproj" "Persistance/Persistance.csproj"
COPY "Domain/Domain.csproj" "Domain/Domain.csproj"
COPY "Infrastructure/Infrastructure.csproj" "Infrastructure/Infrastructure.csproj"

RUN dotnet restore "code.sln"

#copy everything else
COPY . .
WORKDIR /app
RUN dotnet publish -c Release -o out

#build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT [ "dotnet", "API.dll" ] 

