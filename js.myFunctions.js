$(document).ready(function() {
    // إظهار نموذج طلب الوجبات عند الضغط على زر متابعة
    window.showForm = function() {
        $("#orderForm").slideDown(500); //إظهار النموذج بتأثير الانزلاق للاسفل
    };

    // (المكونات والصورة)إظهار وإخفاء تفاصيل الوجبات
    window.toggleDetails = function(id) {
        $("#" + id).fadeToggle(400);//إظهار او اخفاء بتأثير التلاشي
    };

    //  دالة داخلية تقوم بمسح الوجبات المختارة وحساب المجموع المالي
    function calculateOrder() {
        let selectedItems = []; //مصفوفة لتخزين اسماء الوجبات المختارة
        let total = 0; //متغير لتجميع السعر الاجمالي

        //المرور على كل صف في الجدول باستثناء صفوف التفاصيل المخفية
        $("tbody tr:not([id])").each(function() {
            let row = $(this);
            let checkbox = row.find("input[type='checkbox']");
           
            //التحقق إذا قم المستخدم باختيار هذه الوجبة
            if (checkbox.is(":checked")) {
                let name = row.children("td").eq(1).text(); //جلب اسم الوجبة من العمود الثاني
                let priceText = row.children("td").eq(2).text(); //جلب نص السعر
                let price = parseInt(priceText.replace(/[^0-9]/g, '')); //(يعني بدون  كلمة ل.س) استخراج الرقم فقط
               
                selectedItems.push(name); //اضافة الاسم للمصفوفة
                total += price; //اضافة السعر للمجموع
            }
        });

        return { selectedItems, total }; //ارجاع النتائج لاستخدامها لاحقا
    }

    //  إرسال الطلب والتحقق من صحة البيانات المدخلة
    window.submitOrder = function() {
        //جلب القيم من حقول الادخال
        let name = $("#fullName").val().trim();
        let bank = $("#bankAccount").val().trim();
        let date = $("#orderDate").val();
        let phone = $("#phone").val().trim();

        // قواعد التحقق (Regular Expressions)
        let nameRegex = /^[A-Za-z]+ [A-Za-z]+$/; //الاسم يجب ان يكون مقطعين بالانجليزية
        let bankRegex = /^[0-9]{6}$/; //رقم الحساب يجب ان يتكون من 6 ارقام
        let phoneRegex = /^09(3|4|5|8)\d{7}$/; //صيغة ارقام الموبايل في سوريا 

        //بدء عمليات التحقق واظهار رسائل تنبيه في حال وجود خطأ
        if (!bankRegex.test(bank)) {
            alert("رقم الحساب المصرفي غير صحيح (6 أرقام)");
            return;
        }
        if (name && !nameRegex.test(name)) {
            alert("الاسم يجب أن يكون إنجليزي واسم + كنية فقط");
            return;
        }
        if (phone && !phoneRegex.test(phone)) {
            alert("رقم الموبايل السوري غير صحيح");
            return;
        }

        let order = calculateOrder();
        if (order.selectedItems.length === 0) {
            alert("يرجى اختيار وجبة واحدة على الأقل");
            return;
        }
        //حساب الضريبة (10%) والصافي النهائي
        let tax = order.total * 0.10;
        let finalTotal = order.total + tax;
        //إظهار النتيجة النهائية للمستخدم في رسالة واحدة منظمة
        alert(
            "الوجبات المختارة:\n" + order.selectedItems.join(", ") +
            "\n\nالمجموع: " + order.total + " ل.س" +
            "\nالضريبة (10%): " + tax + " ل.س" +
            "\nالصافي: " + finalTotal + " ل.س"
        );
    };
});