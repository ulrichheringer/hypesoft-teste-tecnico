FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY backend/Hypesoft.Domain/Hypesoft.Domain.csproj backend/Hypesoft.Domain/
COPY backend/Hypesoft.Application/Hypesoft.Application.csproj backend/Hypesoft.Application/
COPY backend/Hypesoft.Infrastructure/Hypesoft.Infrastructure.csproj backend/Hypesoft.Infrastructure/
COPY backend/Hypesoft.API/Hypesoft.API.csproj backend/Hypesoft.API/
RUN dotnet restore backend/Hypesoft.API/Hypesoft.API.csproj

COPY backend/ ./backend/
RUN find /src/backend -type d \( -name bin -o -name obj \) -prune -exec rm -rf '{}' +
RUN dotnet restore backend/Hypesoft.API/Hypesoft.API.csproj
WORKDIR /src/backend/Hypesoft.API
RUN dotnet publish -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
RUN apt-get update && \
    apt-get install -y --no-install-recommends fontconfig fonts-dejavu-core curl && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV ASPNETCORE_URLS=http://0.0.0.0:5000
EXPOSE 5000
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Hypesoft.API.dll"]
