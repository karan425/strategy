 
$(document).ready(function() {
    // Theme Toggle
    $('#themeToggle').click(function() {
        $('body').toggleClass('dark-mode');
        const icon = $(this).find('i');
        icon.toggleClass('fa-moon fa-sun');
    });

    // Trendline Analysis Logic
    function updateTrendlineProgress() {
        const totalSteps = 7;
        let completedSteps = 0;

        if ($('#marketTrend').val()) completedSteps++;
        if ($('#trendlineDrawn').is(':checked')) completedSteps++;
        if ($('#timeframe').val()) completedSteps++;
        if ($('#touchPoints').val()) completedSteps++;
        if ($('#structurePattern').val()) completedSteps++;
        if ($('#rsiRange').val()) completedSteps++;
        if ($('#volumeSpike').is(':checked')) completedSteps++;

        const percentage = Math.round((completedSteps / totalSteps) * 100);
        $('#trendlineProgress').css('width', percentage + '%');
        $('#trendlineProgress .progress-label').text(percentage + '%');
        $('#trendlineProgressBadge').text(percentage + '% Complete');

        // Update step indicators
        $('#trendlineForm .step-item').each(function(index) {
            if (index < completedSteps) {
                $(this).removeClass('active').addClass('completed');
                $(this).find('.status-indicator').removeClass('bg-primary bg-secondary').addClass('bg-success');
            } else if (index === completedSteps) {
                $(this).addClass('active').removeClass('completed');
                $(this).find('.status-indicator').removeClass('bg-secondary bg-success').addClass('bg-primary');
            } else {
                $(this).removeClass('active completed');
                $(this).find('.status-indicator').removeClass('bg-primary bg-success').addClass('bg-secondary');
            }
        });
    }

    // Trendline form change handlers
    $('#trendlineForm input, #trendlineForm select').on('change', function() {
        updateTrendlineProgress();
    });

    // RSI auto-check
    $('#rsiValue').on('input', function() {
        const rsi = parseFloat($(this).val());
        if (rsi >= 40 && rsi <= 50) {
            $('#rsiRange').val('yes');
        } else if (rsi) {
            $('#rsiRange').val('no');
        } else {
            $('#rsiRange').val('');
        }
        updateTrendlineProgress();
    });

    // Complete Trendline Analysis
    $('#completeTrendlineAnalysis').click(function() {
        const marketTrend = $('#marketTrend').val();
        const touchPoints = $('#touchPoints').val();
        const structure = $('#structurePattern').val();
        const rsiRange = $('#rsiRange').val();

        let isValid = true;
        let message = '';

        if (!marketTrend || !touchPoints || !structure || !rsiRange) {
            message = 'Please complete all required fields before finishing the analysis.';
            isValid = false;
        } else if (touchPoints === 'less') {
            message = 'Invalid: Minimum 2 touch points required. Wait for more confirmation.';
            isValid = false;
            $('#trendlineForm .step-item[data-step="4"]').addClass('invalid');
        } else if (structure === 'no') {
            message = 'Invalid: Pre-breakdown structure not confirmed. Wait for proper pattern formation.';
            isValid = false;
            $('#trendlineForm .step-item[data-step="5"]').addClass('invalid');
        } else if (rsiRange === 'no') {
            message = 'Invalid: RSI not in rejection zone (40-50). Ignore this breakdown.';
            isValid = false;
            $('#trendlineForm .step-item[data-step="6"]').addClass('invalid');
        } else {
            message = '✅ Valid Breakdown Condition Met!';
            $('#trendlineResult').html(`
                <div class="result-card">
                    <i class="fas fa-check-circle fa-4x mb-3"></i>
                    <h3>Analysis Completed Successfully</h3>
                    <p class="mb-3">All conditions validated. Ready for trade execution.</p>
                    <div class="row text-start">
                        <div class="col-md-6">
                            <strong>Market Trend:</strong> ${marketTrend.toUpperCase()}<br>
                            <strong>Touch Points:</strong> ${touchPoints}<br>
                            <strong>Structure:</strong> HH → HL → LH → LL ✓
                        </div>
                        <div class="col-md-6">
                            <strong>RSI Range:</strong> 40-50 ✓<br>
                            <strong>Volume Spike:</strong> ${$('#volumeSpike').is(':checked') ? 'Confirmed' : 'Not checked'}<br>
                            <strong>Status:</strong> <span class="badge bg-light text-success">READY</span>
                        </div>
                    </div>
                </div>
            `).fadeIn();
        }

        if (!isValid) {
            $('#trendlineResult').html(`
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>Analysis Failed:</strong> ${message}
                </div>
            `).fadeIn();
        }

        $('#modalMessage').text(isValid ? 'Breakdown Analysis Complete!' : 'Analysis Incomplete');
        $('#modalDetails').text(message);
        $('#successModal').modal('show');
    });

    // Reset Trendline
    $('#resetTrendline').click(function() {
        $('#trendlineForm')[0].reset();
        $('#trendlineResult').fadeOut();
        $('#trendlineForm .step-item').removeClass('completed invalid');
        updateTrendlineProgress();
    });

    // Triangle Analysis Logic
    function updateTriangleProgress() {
        const totalSteps = 6;
        let completedSteps = 0;

        if ($('#flatTop').val()) completedSteps++;
        if ($('#higherLows').val()) completedSteps++;
        if ($('#breakoutCandle').val()) completedSteps++;
        if ($('#emaPosition').val()) completedSteps++;
        if ($('#pullbackConfirmed').is(':checked')) completedSteps++;
        if ($('#entryPrice').val() && $('#stopLoss').val()) completedSteps++;

        const percentage = Math.round((completedSteps / totalSteps) * 100);
        $('#triangleProgress').css('width', percentage + '%');
        $('#triangleProgress .progress-label').text(percentage + '%');
        $('#triangleProgressBadge').text(percentage + '% Complete');

        // Update step indicators
        $('#triangleForm .step-item').each(function(index) {
            if (index < completedSteps) {
                $(this).removeClass('active').addClass('completed');
                $(this).find('.status-indicator').removeClass('bg-primary bg-secondary').addClass('bg-success');
            } else if (index === completedSteps) {
                $(this).addClass('active').removeClass('completed');
                $(this).find('.status-indicator').removeClass('bg-secondary bg-success').addClass('bg-primary');
            } else {
                $(this).removeClass('active completed');
                $(this).find('.status-indicator').removeClass('bg-primary bg-success').addClass('bg-secondary');
            }
        });
    }

    // Triangle form change handlers
    $('#triangleForm input, #triangleForm select').on('change input', function() {
        updateTriangleProgress();
    });

    // Auto-calculate target (1:3 R:R)
    $('#entryPrice, #stopLoss').on('input', function() {
        const entry = parseFloat($('#entryPrice').val());
        const stop = parseFloat($('#stopLoss').val());
        
        if (entry && stop && entry > stop) {
            const risk = entry - stop;
            const target = entry + (risk * 3);
            $('#targetPrice').val(target.toFixed(2));
        } else {
            $('#targetPrice').val('');
        }
        updateTriangleProgress();
    });

    // Complete Triangle Analysis
    $('#completeTriangleAnalysis').click(function() {
        const flatTop = $('#flatTop').val();
        const higherLows = $('#higherLows').val();
        const breakout = $('#breakoutCandle').val();
        const ema = $('#emaPosition').val();
        const entry = $('#entryPrice').val();
        const stop = $('#stopLoss').val();
        const target = $('#targetPrice').val();

        let isValid = true;
        let message = '';

        if (!flatTop || !higherLows || !breakout || !ema) {
            message = 'Please complete all required validation fields.';
            isValid = false;
        } else if (flatTop === 'no') {
            message = 'Invalid: Flat top resistance not confirmed. Structure is invalid.';
            isValid = false;
            $('#triangleForm .step-item[data-step="1"]').addClass('invalid');
        } else if (higherLows === 'no') {
            message = 'Invalid: Higher lows not confirmed. Triangle structure is invalid.';
            isValid = false;
            $('#triangleForm .step-item[data-step="2"]').addClass('invalid');
        } else if (breakout === 'no') {
            message = 'Invalid: False breakout detected. Wait for valid breakout.';
            isValid = false;
            $('#triangleForm .step-item[data-step="3"]').addClass('invalid');
        } else if (ema === 'no') {
            message = 'Invalid: EMA alignment not bullish. Avoid this trade.';
            isValid = false;
            $('#triangleForm .step-item[data-step="4"]').addClass('invalid');
        } else if (!entry || !stop) {
            message = 'Please enter Entry Price and Stop Loss to execute trade.';
            isValid = false;
        } else {
            message = '🎯 Trade Executed Successfully!';
            const riskAmount = (parseFloat(entry) - parseFloat(stop)).toFixed(2);
            const rewardAmount = (parseFloat(target) - parseFloat(entry)).toFixed(2);
            
            $('#triangleResult').html(`
                <div class="result-card">
                    <i class="fas fa-rocket fa-4x mb-3"></i>
                    <h3>Trade Execution Complete</h3>
                    <p class="mb-3">All conditions validated. Trade parameters set.</p>
                    <div class="row text-start">
                        <div class="col-md-6 mb-3">
                            <h6>Entry Details</h6>
                            <strong>Entry Price:</strong> ${entry}<br>
                            <strong>Stop Loss:</strong> ${stop}<br>
                            <strong>Target:</strong> ${target}
                        </div>
                        <div class="col-md-6 mb-3">
                            <h6>Risk Management</h6>
                            <strong>Risk:</strong> ${riskAmount}<br>
                            <strong>Reward:</strong> ${rewardAmount}<br>
                            <strong>R:R Ratio:</strong> 1:3 ✓
                        </div>
                    </div>
                    <div class="alert alert-light mt-3">
                        <strong>Pullback:</strong> ${$('#pullbackConfirmed').is(':checked') ? 'Confirmed (2-3 candles)' : 'Direct entry'}<br>
                        <strong>Status:</strong> <span class="badge bg-success">ACTIVE TRADE</span>
                    </div>
                </div>
            `).fadeIn();
        }

        if (!isValid) {
            $('#triangleResult').html(`
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>Trade Rejected:</strong> ${message}
                </div>
            `).fadeIn();
        }

        $('#modalMessage').text(isValid ? 'Trade Executed!' : 'Trade Rejected');
        $('#modalDetails').text(message);
        $('#successModal').modal('show');
    });

    // Reset Triangle
    $('#resetTriangle').click(function() {
        $('#triangleForm')[0].reset();
        $('#triangleResult').fadeOut();
        $('#triangleForm .step-item').removeClass('completed invalid');
        updateTriangleProgress();
    });

    // Initialize progress
    updateTrendlineProgress();
    updateTriangleProgress();
});