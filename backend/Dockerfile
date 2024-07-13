FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

WORKDIR /src

COPY ["ChatApplication.sln", "./"]
COPY ["MongoDLL/MongoDLL.csproj", "MongoDLL/"]
COPY ["SignalRLearning/SignalRLearning.csproj", "SignalRLearning/"]
RUN dotnet restore

COPY . .

RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:6.0

WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 80

ENTRYPOINT ["dotnet", "SignalRLearning.dll"]