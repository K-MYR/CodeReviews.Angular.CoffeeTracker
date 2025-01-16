using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoffeeTracker.K_MYR.Server.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class CreateIndexOnDateTimeColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_CoffeeRecords_DateTime",
                table: "CoffeeRecords",
                column: "DateTime");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CoffeeRecords_DateTime",
                table: "CoffeeRecords");
        }
    }
}
