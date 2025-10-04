using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using System.Collections.Generic;
using System.Linq;

namespace Gauteng_Enterprise_Propeller.Pages.Resources
{
    public class DocumentsModel : PageModel
    {
        private readonly IWebHostEnvironment _environment;

        public DocumentsModel(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        public List<ReportFile> AnnualReports { get; set; } = new List<ReportFile>();

        public void OnGet()
        {
            var reportsPath = Path.Combine(_environment.WebRootPath, "annual-reports");

            if (Directory.Exists(reportsPath))
            {
                var pdfFiles = Directory.GetFiles(reportsPath, "*.pdf");

                AnnualReports = pdfFiles.Select(filePath => new ReportFile
                {
                    FileName = Path.GetFileName(filePath),
                    DisplayName = GetDisplayName(Path.GetFileName(filePath)),
                    FilePath = $"/annual-reports/{Path.GetFileName(filePath)}",
                    FileSize = GetFileSize(filePath),
                    Year = ExtractYear(Path.GetFileName(filePath))
                })
                .OrderByDescending(r => r.Year)
                .ToList();
            }
        }

        private string GetDisplayName(string fileName)
        {
            // Remove .pdf extension
            var nameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);

            // Replace hyphens and underscores with spaces
            var displayName = nameWithoutExtension.Replace("-", " ").Replace("_", " ");

            // Capitalize first letter of each word
            return System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(displayName.ToLower());
        }

        private string GetFileSize(string filePath)
        {
            var fileInfo = new FileInfo(filePath);
            var sizeInMB = fileInfo.Length / 1024.0 / 1024.0;

            if (sizeInMB < 1)
            {
                return $"{(fileInfo.Length / 1024.0):F1} KB";
            }

            return $"{sizeInMB:F1} MB";
        }

        private int ExtractYear(string fileName)
        {
            // Try to extract a 4-digit year from the filename
            var match = System.Text.RegularExpressions.Regex.Match(fileName, @"\b(20\d{2}|19\d{2})\b");

            if (match.Success && int.TryParse(match.Value, out int year))
            {
                return year;
            }

            return 0; // Default year if not found
        }
    }

    public class ReportFile
    {
        public string FileName { get; set; }
        public string DisplayName { get; set; }
        public string FilePath { get; set; }
        public string FileSize { get; set; }
        public int Year { get; set; }
    }
}