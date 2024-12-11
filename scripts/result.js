function shareResult() {
    if (RESULT != {}) {
        const workbook = XLSX.utils.book_new();

        const formatted_result = [];

        for (const date in RESULT) {
            formatted_result.push([date].concat(RESULT[date]))
        }

        const worksheet = XLSX.utils.aoa_to_sheet(formatted_result);

        XLSX.utils.book_append_sheet(workbook, worksheet, "Result");

        var max = 0;
        
        for (const k in RESULT) {
            max = Math.max(max, RESULT[k].length);
        }

        worksheet["!cols"] = new Array(max+1).fill({wch: 8, wpx: 200});

        if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 || navigator.userAgent.indexOf("Chrome") != -1) {

            const file = XLSX.write(workbook, {type: "base64", booktype: "xlsx", cellStyles: true});

            let element = document.createElement('a');
            element.setAttribute('href',
                'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'
                + file);
            element.setAttribute('download', 'Programmate.xlsx');
            document.body.appendChild(element);
            element.click();

            document.body.removeChild(element);

        } else if (navigator.userAgent.indexOf("Safari") != -1) {
            const file = XLSX.write(workbook, {type: "array", booktype: "xlsx", cellStyles: true});
        
            const fileobj = {
                "title": "Programmate",
                "text": "Exporting data as XSLX",
                "files": [
                    new File(
                        [file],
                        'Programmate.xlsx', 
                        {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        }
                    )
                ],
            };

            if (navigator.canShare(fileobj)) {
                navigator.share(fileobj);
            } else {
                console.error("Cannot share object");
            }
        }
    }
}