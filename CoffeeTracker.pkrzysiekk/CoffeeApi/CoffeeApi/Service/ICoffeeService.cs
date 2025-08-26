using CoffeeApi.Models;

namespace CoffeeApi.Service;

public interface ICoffeeService
{
    public Task<CoffeeConsumption?> GetById(int id);
    public Task<IEnumerable<CoffeeConsumption>> GetPaginatedList(int page, int size);
    public Task Add(CoffeeConsumption coffeeConsumption);
    public Task Update(CoffeeConsumption coffeeConsumption);
    public Task Delete(int id);
    
}