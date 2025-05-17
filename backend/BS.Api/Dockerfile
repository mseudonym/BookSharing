FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /app

EXPOSE 443

# Copy project directories from root of repo
COPY ../BS.Api/ BS.Api/
COPY ../BS.Core/ BS.Core/
COPY ../BS.Data/ BS.Data/

# Restore and build
WORKDIR /app/BS.Api
RUN dotnet restore BS.Api.csproj
RUN dotnet publish -c Release -o /app/out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "BS.Api.dll"]
