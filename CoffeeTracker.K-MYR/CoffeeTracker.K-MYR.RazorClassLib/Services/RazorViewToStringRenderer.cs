using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace CoffeeTracker.K_MYR.RazorClassLib.Services;

public interface IRazorViewToStringRenderer
{
    Task<string> RenderViewToStringAsync<TModel>(string viewName, TModel model);
}

public class RazorViewToStringRenderer(IRazorViewEngine engine, ITempDataProvider tempDataProvider, IServiceScopeFactory scopeFactory)
    : IRazorViewToStringRenderer
{
    private readonly IRazorViewEngine _engine = engine;
    private readonly ITempDataProvider _tempDataProvider = tempDataProvider;
    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;

    public async Task<string> RenderViewToStringAsync<TModel>(string viewName, TModel model)
    {
        using var scope = _scopeFactory.CreateScope();
        var httpContext = new DefaultHttpContext()
        {
            RequestServices = scope.ServiceProvider
        };
        var actionContext = new ActionContext(httpContext, new RouteData(), new ActionDescriptor());
        var view = FindView(actionContext, viewName);

        using var output = new StringWriter();
        var viewContext = new ViewContext(
            actionContext,
            view,
            new ViewDataDictionary<TModel>(
                metadataProvider: new EmptyModelMetadataProvider(),
                modelState: new ModelStateDictionary())
            {
                Model = model,
            },
            new TempDataDictionary(
                actionContext.HttpContext,
                _tempDataProvider),
            output,
            new HtmlHelperOptions()
        );
        await view.RenderAsync(viewContext);
        return output.ToString();
    }

    private  IView FindView(ActionContext actionContext, string viewName)
    {
        var getViewResult = _engine.GetView(null, viewPath: viewName, isMainPage: true);
        if (getViewResult.Success)
        {
            return getViewResult.View;
        }

        var findViewResult = _engine.FindView(actionContext, viewName, isMainPage: true);
        if (findViewResult.Success)
        {
            return findViewResult.View;
        }

        var searchedLocations = getViewResult.SearchedLocations.Concat(findViewResult.SearchedLocations);
        var errorMessage = string.Join(
            Environment.NewLine,
            new[] { $"Unable to find view '{viewName}'. The following locations were searched:" }.Concat(searchedLocations)); ;

        throw new InvalidOperationException(errorMessage);
    }
}
