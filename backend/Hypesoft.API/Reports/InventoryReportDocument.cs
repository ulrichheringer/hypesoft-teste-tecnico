using Hypesoft.Application.DTOs;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System.Globalization;

namespace Hypesoft.API.Reports;

public sealed class InventoryReportDocument(DashboardSummaryDto summary) : IDocument
{
    private readonly DashboardSummaryDto _summary = summary;
    private readonly Dictionary<Guid, string> _categoryMap = summary.Categories
        .ToDictionary(category => category.Id, category => category.Name);
    private readonly CultureInfo _culture = CultureInfo.GetCultureInfo("pt-BR");

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Margin(32);
            page.Size(PageSizes.A4);
            page.DefaultTextStyle(style => style.FontSize(11).FontColor(Colors.Black));

            page.Header().Column(column =>
            {
                column.Item().Text("Relatorio de estoque").FontSize(18).SemiBold();
                column.Item().Text($"Gerado em {DateTime.UtcNow:dd/MM/yyyy HH:mm} (UTC)")
                    .FontSize(10)
                    .FontColor(Colors.Grey.Darken2);
            });

            page.Content().Column(column =>
            {
                column.Spacing(14);

                column.Item().Row(row =>
                {
                    row.Spacing(12);
                    row.RelativeItem().Element(StatCard).Text(text =>
                    {
                        text.Span("Produtos: ").SemiBold();
                        text.Span(_summary.TotalProducts.ToString("N0", _culture)).FontColor(Colors.Black);
                    });
                    row.RelativeItem().Element(StatCard).Text(text =>
                    {
                        text.Span("Valor do estoque: ").SemiBold();
                        text.Span(_summary.StockValue.ToString("C", _culture)).FontColor(Colors.Black);
                    });
                    row.RelativeItem().Element(StatCard).Text(text =>
                    {
                        text.Span("Baixo estoque: ").SemiBold();
                        text.Span(_summary.LowStockCount.ToString("N0", _culture)).FontColor(Colors.Black);
                    });
                });

                column.Item().Element(SectionTitle).Text("Resumo");
                column.Item().Text(text =>
                {
                    text.Span("Categorias cadastradas: ").SemiBold();
                    text.Span(_summary.Categories.Count.ToString("N0", _culture)).FontColor(Colors.Black);
                });
                column.Item().Text(text =>
                {
                    text.Span("Produtos abaixo do limite: ").SemiBold();
                    text.Span(_summary.LowStockItems.Count.ToString("N0", _culture)).FontColor(Colors.Black);
                });

                column.Item().Element(SectionTitle).Text("Itens com baixo estoque");
                column.Item().Element(section => ComposeProductTable(section, _summary.LowStockItems));

                column.Item().Element(SectionTitle).Text("Produtos");
                column.Item().Element(section => ComposeProductTable(section, _summary.Products));

                column.Item().Element(SectionTitle).Text("Categorias");
                column.Item().Element(ComposeCategoryTable);

                column.Item().Element(SectionTitle).Text("Tendência (últimos 7 dias)");
                column.Item().Element(ComposeTrendTable);
            });
        });
    }

    private static IContainer StatCard(IContainer container)
        => container.Border(1).BorderColor(Colors.Grey.Lighten2).Padding(8);

    private static IContainer SectionTitle(IContainer container)
        => container.PaddingBottom(4).BorderBottom(1).BorderColor(Colors.Grey.Lighten2);

    private void ComposeProductTable(IContainer container, IReadOnlyList<ProductDto> products)
    {
        if (products.Count == 0)
        {
            container.Text("Sem itens.");
            return;
        }

        container.Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.RelativeColumn(3);
                columns.RelativeColumn(2);
                columns.RelativeColumn(1);
                columns.RelativeColumn(2);
            });

            table.Header(header =>
            {
                header.Cell().Element(HeaderCell).Text("Produto");
                header.Cell().Element(HeaderCell).Text("Categoria");
                header.Cell().Element(HeaderCell).Text("Estoque");
                header.Cell().Element(HeaderCell).Text("Criado em");
            });

            foreach (var product in products)
            {
                table.Cell().Element(BodyCell).Text(product.Name);
                table.Cell().Element(BodyCell).Text(GetCategoryName(product.CategoryId));
                table.Cell().Element(BodyCell).Text(product.Stock.ToString());
                table.Cell().Element(BodyCell).Text(product.CreatedAt.ToString("dd/MM/yyyy"));
            }
        });
    }

    private string GetCategoryName(Guid categoryId)
        => _categoryMap.TryGetValue(categoryId, out var name) ? name : "Sem categoria";

    private static IContainer HeaderCell(IContainer container)
        => container
            .PaddingVertical(4)
            .BorderBottom(1)
            .BorderColor(Colors.Grey.Lighten2)
            .DefaultTextStyle(text => text.SemiBold());

    private static IContainer BodyCell(IContainer container)
        => container.PaddingVertical(3);

    private void ComposeCategoryTable(IContainer container)
    {
        if (_summary.CategoryChart.Count == 0)
        {
            container.Text("Sem categorias cadastradas.");
            return;
        }

        container.Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.RelativeColumn(3);
                columns.RelativeColumn(1);
            });

            table.Header(header =>
            {
                header.Cell().Element(HeaderCell).Text("Categoria");
                header.Cell().Element(HeaderCell).Text("Qtde");
            });

            foreach (var category in _summary.CategoryChart)
            {
                table.Cell().Element(BodyCell).Text(category.Label);
                table.Cell().Element(BodyCell).Text(category.Value.ToString("N0", _culture));
            }
        });
    }

    private void ComposeTrendTable(IContainer container)
    {
        if (_summary.Trend.Count == 0)
        {
            container.Text("Sem movimentação recente.");
            return;
        }

        container.Table(table =>
        {
            table.ColumnsDefinition(columns =>
            {
                columns.RelativeColumn(2);
                columns.RelativeColumn(2);
                columns.RelativeColumn(2);
            });

            table.Header(header =>
            {
                header.Cell().Element(HeaderCell).Text("Dia");
                header.Cell().Element(HeaderCell).Text("Valor");
                header.Cell().Element(HeaderCell).Text("Média");
            });

            foreach (var point in _summary.Trend)
            {
                table.Cell().Element(BodyCell).Text(point.Label);
                table.Cell().Element(BodyCell).Text(point.Value.ToString("C", _culture));
                table.Cell().Element(BodyCell).Text(point.Benchmark.ToString("C", _culture));
            }
        });
    }
}
