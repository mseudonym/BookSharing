FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /BS.Api

EXPOSE 443

# Copy everything
COPY "BS.Api/" "BS.Api/"
COPY "BS.Core/" "BS.Core/"
COPY "BS.Data/" "BS.Data/"

# Restore as distinct layers
RUN dotnet restore "BS.Api/BS.Api.csproj"
# Build and publish a release
RUN dotnet publish -c Release -o out "BS.Api/BS.Api.csproj"

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /BS.Api
COPY --from=build-env /BS.Api/out .
ENTRYPOINT ["dotnet", "BS.Api.dll"]
