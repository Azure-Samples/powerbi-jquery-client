
$(function () {
    var $form = $('#search-form');
    var $input = $('#searchinput');
    var $filterPaneCheckbox = $('#filterPaneCheckbox');
    var $reportsList = $('#reportslist');
    var $reportsListCount = $('#reportslistcount');
    var $staticReport = $('#reportstatic');
    var $dynamicReport = $('#reportdynamic');
    var $resetButton = $('#resetButton');
    var $showAllButton = $('#showAllButton');
    
    // Load and embed static report
    var apiBaseUrl = 'http://powerbipaasapi.azurewebsites.net/api/reports';
    var staticReportId = '5dac7a4a-4452-46b3-99f6-a25915e0fe55';
    var staticReportUrl = apiBaseUrl + '/' + staticReportId;
    
    fetch(staticReportUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (report) {
            // Currently the type must match the types available in PowerBi.componentTypes array
            // TODO: Split typename and type attribute to separate properties.
            var reportConfig = $.extend({ type: 'report' }, report);
            $staticReport.powerbi(reportConfig);
        });

    function generateReportListItem(report) {
        var button = $('<button>')
            .attr({
                type: 'button'
            })
            .addClass('btn btn-success')
            .data('report', report)
            .text('Embed!');
        
        var reportName = $('<span />')
            .addClass('report-name')
            .text(report.name)
        
        var element = $('<li>')
            .append(reportName)
            .append(button);
        
        return element;
    }
    
    // Search reports when form is submitted
    $form.on('submit', function (event) {
        event.preventDefault();
        var query = $input.val();
        var url = apiBaseUrl + '?query=' + query;

        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function (reports) {
                $reportsListCount.text(reports.length);
                $reportsList.empty();
                reports
                    .map(generateReportListItem)
                    .forEach(function (element) {
                        $reportsList.append(element);
                    });
            });
    });
   
    // When report button is clicked embed the report
    $reportsList.on('click', 'button', function (event) {
        var button = event.target;
        var report = $(button).data('report');
        var url = apiBaseUrl + '/' + report.id;
        
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (reportWithToken) {
                // TODO: Split typename and type attribute to separate properties.
                var filterPaneEnabled = $filterPaneCheckbox.prop('checked');
                var reportConfig = $.extend({ type: 'report', filterPaneEnabled: filterPaneEnabled }, reportWithToken);
                $dynamicReport.powerbi(reportConfig);
            });
    });
    
    $resetButton.on('click', function (event) {
        console.log('reset');
        powerbi.reset($dynamicReport.get(0));
    });
    
    $showAllButton.on('click', function (event) {
        var url = apiBaseUrl;
        
        fetch(url)
            .then(function(response) {
                return response.json();
            })
            .then(function (reports) {
                $reportsListCount.text(reports.length);
                $reportsList.empty();
                reports
                    .map(generateReportListItem)
                    .forEach(function (element) {
                        $reportsList.append(element);
                    });
            });
    });
});