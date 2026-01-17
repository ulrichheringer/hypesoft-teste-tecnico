using Hypesoft.Application.DTOs;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Hypesoft.API.Reports;

public sealed class InventoryReportDocument(DashboardSummaryDto summary) : IDocument
{
    private readonly DashboardSummaryDto _summary = summary;
    private readonly Dictionary<Guid, string> _categoryMap = summary.Categories
        .ToDictionary(category => category.Id, category => category.Name);

    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Margin(32);
            page.Size(PageSizes.A4);
            page.DefaultTextStyle(style => style.FontSize(11));

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
                    row.RelativeItem().Element(StatCard).Text($"Produtos: {_summary.TotalProducts}");
                    row.RelativeItem().Element(StatCard).Text($"Valor do estoque: {_summary.StockValue:C}");
                    row.RelativeItem().Element(StatCard).Text($"Baixo estoque: {_summary.LowStockCount}");
                });

                column.Item().Element(SectionTitle).Text("Itens com baixo estoque");
                column.Item().Element(section => ComposeProductTable(section, _summary.LowStockItems));

                column.Item().Element(SectionTitle).Text("Top produtos");
                column.Item().Element(section => ComposeProductTable(section, _summary.TopProducts));

                column.Item().Element(SectionTitle).Text("Produtos recentes");
                column.Item().Element(section => ComposeProductTable(section, _summary.RecentProducts));
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
}
