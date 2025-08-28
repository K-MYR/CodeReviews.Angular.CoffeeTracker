using CoffeeApi.Data;
using CoffeeApi.Models;
using CoffeeApi.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CoffeeApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CoffeeController : ControllerBase
{
    private readonly ICoffeeService  _coffeeService;

    public CoffeeController(ICoffeeService coffeeService)
    {
        _coffeeService = coffeeService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CoffeeConsumption>> GetById(int id)
    {
        var coffee = await _coffeeService.GetById(id);
        if (coffee == null)
            return NotFound(id);
        return coffee;
    }
    [HttpGet]
    public async Task<IEnumerable<CoffeeConsumption>> 
        GetPaginatedResult([FromQuery] int page, [FromQuery] int pageSize)
    {
        var paginatedResult= await 
            _coffeeService.GetPaginatedList(page, pageSize);
        return paginatedResult;
    }

    [HttpPost]
    public async Task Create([FromBody] CoffeeConsumption coffeeConsumption)
    {
        if (!ModelState.IsValid)
            BadRequest(ModelState);
        
        await _coffeeService.Add(coffeeConsumption);
    }

    [HttpPut]
    public async Task Update( [FromBody] CoffeeConsumption coffeeConsumption)
    {
       if (!ModelState.IsValid)
           BadRequest(ModelState);
       await _coffeeService.Update(coffeeConsumption);
    }

    [HttpDelete("{id}")]
    public async Task Delete(int id)
    {
        await _coffeeService.Delete(id);
    }
}