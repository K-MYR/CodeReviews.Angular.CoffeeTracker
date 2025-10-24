using CoffeeTracker.K_MYR.Common;

var builder = DistributedApplication.CreateBuilder(args);
builder.AddDockerComposeEnvironment("env");

var papercut = builder.AddPapercutSmtp(ResourceNames.Papercut)
    .WithEndpoint("http", e =>
    {
        e.TargetPort = 80;
        e.IsExternal = true;
    });

var database = builder.AddPostgres(ResourceNames.Postgres)
    .WithDataVolume()
    .WithPgAdmin()
    .AddDatabase(ResourceNames.Database);

var apiProj = builder.AddProject<Projects.CoffeeTracker_K_MYR_WebApi>(ResourceNames.WebApi)
    .WithExternalHttpEndpoints();

var angularProj = builder.AddNpmApp(ResourceNames.AngularApp, "../CoffeeTracker.K-MYR.Client")
    .WithHttpsEndpoint(port: 423, targetPort: 4000, env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

apiProj.WithReference(papercut)
    .WaitFor(papercut)
    .WithReference(database)
    .WaitFor(database)
    .WithReference(angularProj);

angularProj.WithReference(apiProj)
    .WaitFor(apiProj);

var migrations = builder.AddProject<Projects.CoffeeTracker_K_MYR_MigrationService>(ResourceNames.Migrations)
.WithReference(database)
.WaitFor(database);
apiProj.WaitForCompletion(migrations);

builder.Build().Run();
