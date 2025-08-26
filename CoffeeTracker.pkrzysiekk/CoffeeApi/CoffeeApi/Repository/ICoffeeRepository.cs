namespace CoffeeApi.Repository;

public interface IRepository<T> where T : class
{
   public Task Create(T item);
   public Task Update(T item);
   public Task Delete(int id);
   public Task<T?> GetById(int id);
   public IQueryable<T> GetAll();
   public Task SaveChanges();
}