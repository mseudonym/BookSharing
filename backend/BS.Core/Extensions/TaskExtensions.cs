using System.Collections.Concurrent;

namespace BS.Core.Extensions;

public static class TaskExtensions
{
    public static async Task<T[]> WhenAllAsync<T>(this IEnumerable<Task<T>> tasks)
    {
        var resultBag = new ConcurrentBag<T>();

        await Parallel.ForEachAsync(tasks, async (task, _) =>
        {
            var result = await task;
            resultBag.Add(result);
        });

        return resultBag.ToArray();
    }
}