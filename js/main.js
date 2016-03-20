(function() {
    var canvas = document.getElementById('paint_area'),
        toolbar = document.getElementById('toolbar'),
        font_weight = document.getElementById('font_weight'),
        font_weight_value = document.getElementById('font_weight_value'),
        font_color = document.getElementById('font_color'),
        font_color_value = document.getElementById('font_color_value'),
        clean_btn = document.getElementById('clean_btn'),
        output_btn = document.getElementById('output_btn'),
        output = document.getElementById('output'),
        canvasWidth = Math.min(550, document.body.scrollWidth * 0.8),
        canvasHeight = canvasWidth,
        ctx = canvas.getContext('2d'),
        isPress = false,
        strokeStyle = '#000',
        lineWidth = font_weight.value,
        lineCap = 'round',
        lineJoin = 'round',
        touch;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    toolbar.style.width = canvasWidth + 'px';

    // 添加滑块监听事件
    font_weight.addEventListener('change', function(e) {
        font_weight_value.innerText = this.value;
        lineWidth = this.value;
    });

    // 添加颜色选择监听
    font_color.addEventListener('change', function(e) {
        font_color_value.innerText = this.value;
        strokeStyle = this.value;
    });

    // 清空画布
    clean_btn.onclick = function() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    };

    // 生成图片
    output_btn.onclick = function() {
        var output_img = document.getElementById('output_img');
        output_img.href = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
        output_img.innerHTML = '点击下载';
    };

    // 添加触屏监听事件
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault(); //阻止了浏览器继续处理触摸事件 (这同样也阻止了鼠标事件的传递)
        touch = e.touches[0]; //多点触控的第一个
        beginPaint(windowToCanvas(touch.pageX, touch.pageY));
    });
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (isPress) {
            touch = e.touches[0];
            movePaint(windowToCanvas(touch.pageX, touch.pageY));
        }
    });
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        endPaint();
    });

    // 添加鼠标监听事件
    canvas.addEventListener('mousedown', function(e) {
        e.preventDefault();
        beginPaint(windowToCanvas(e.clientX, e.clientY));
    });
    canvas.addEventListener('mousemove', function(e) {
        e.preventDefault();
        if (isPress) {
            movePaint(windowToCanvas(e.clientX, e.clientY));
        }
    });
    canvas.addEventListener('mouseup', function(e) {
        e.preventDefault();
        endPaint();
    });

    // 绘图处理
    function beginPaint(point) {
        isPress = true;
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = lineCap;
        ctx.lineJoin = lineJoin;
        ctx.moveTo(point.x, point.y);
    }

    function movePaint(point) {
        if (isPress) {
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
        }
    }

    function endPaint() {
        isPress = false;
    }

    // 坐标系转换
    function windowToCanvas(x, y) {
        var bbox = canvas.getBoundingClientRect()
        return { x: Math.round(x - bbox.left), y: Math.round(y - bbox.top) }
    }
})();