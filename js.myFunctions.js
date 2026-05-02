function showForm() {
    document.getElementById("orderForm").style.display = "block";
}

// إظهار/إخفاء تفاصيل الوجبات 
function toggleDetails(id) {
    var row = document.getElementById(id);
    if (row.style.display === "none") {
        row.style.display = "table-row";
    } else {
        row.style.display = "none";
    }
}

// جمع الوجبات المختارة + حساب السعر
function calculateOrder() {
    let checkboxes = document.querySelectorAll("tbody input[type='checkbox']");
    let rows = document.querySelectorAll("tbody tr");
    let selectedItems = [];
    let total = 0;

    checkboxes.forEach((cb, index) => {
        if (cb.checked) {
            let row = rows[index * 2]; // الصف الأساسي
            let name = row.children[1].innerText;
            let priceText = row.children[2].innerText;
            let price = parseInt(priceText);

            selectedItems.push(name);
            total += price;
        }
    });

    return { selectedItems, total };
}

// إرسال الطلب + التحقق
function submitOrder() {

    let name = document.getElementById("fullName").value.trim();
    let bank = document.getElementById("bankAccount").value.trim();
    let date = document.getElementById("orderDate").value;
    let phone = document.getElementById("phone").value.trim();

    // اسم إنجليزي + مسافة واحدة
    let nameRegex = /^[A-Za-z]+ [A-Za-z]+$/;

    // رقم حساب 6 خانات
    let bankRegex = /^[0-9]{6}$/;

    // تاريخ yyyy-mm-dd
    let dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    // موبايل (سوري)
    let phoneRegex = /^09(3|4|5|8)\d{7}$/;

    if (!bankRegex.test(bank)) {
        alert("رقم الحساب المصرفي غير صحيح (6 أرقام)");
        return;
    }

    if (name && !nameRegex.test(name)) {
        alert("الاسم يجب أن يكون إنجليزي واسم + كنية فقط");
        return;
    }

    if (date && !dateRegex.test(date)) {
        alert("تاريخ غير صحيح");
        return;
    }

    if (phone && !phoneRegex.test(phone)) {
        alert("رقم الموبايل غير صحيح");
        return;
    }

    let order = calculateOrder();

    let tax = order.total * 0.10;
    let finalTotal = order.total + tax;

    alert(
        "الوجبات المختارة:\n" + order.selectedItems.join(", ") +
        "\n\nالمجموع: " + order.total +
        "\nالضريبة (10%): " + tax +
        "\nالصافي: " + finalTotal
    );
}