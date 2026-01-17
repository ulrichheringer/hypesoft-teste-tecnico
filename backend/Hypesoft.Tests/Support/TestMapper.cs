using AutoMapper;
using Hypesoft.Application.Mapping;

namespace Hypesoft.Tests.Support;

public static class TestMapper
{
    public static IMapper Create()
    {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        return config.CreateMapper();
    }
}
