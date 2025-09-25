using CoffeeTracker.K_MYR.Common;

var builder = DistributedApplication.CreateBuilder(args);

builder.AddDockerComposeEnvironment("env");
var papercut = builder.AddPapercutSmtp(ResourceNames.Papercut)
    .WithEndpoint("http", e =>
    {
        e.TargetPort = 80;
        e.IsExternal = true;
    });

var sqlPassword = builder.AddParameter($"{ResourceNames.SqlServer}-password", secret: true);
var sql = builder.AddSqlServer(ResourceNames.SqlServer, sqlPassword)
    .WithDataVolume();

var database = sql.AddDatabase(ResourceNames.Database);

var apiProj = builder.AddProject<Projects.CoffeeTracker_K_MYR_WebApi>(ResourceNames.WebApi)
    .WithReference(papercut)
    .WaitFor(papercut)
    .WithReference(database)
    .WaitFor(database)
    .WithExternalHttpEndpoints();

builder.AddNpmApp(ResourceNames.AngularApp, "../CoffeeTracker.K-MYR.Client")
    .WithReference(apiProj)
    .WaitFor(apiProj)
    .WithHttpsEndpoint(targetPort: 4000,env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
