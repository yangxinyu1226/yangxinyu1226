document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const navLinksJs = document.querySelectorAll('.nav-link-js'); // For buttons acting as links
    const pageSections = document.querySelectorAll('.page-section');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-links');

    // --- Page Navigation (SPA Simulation) ---
    function setActivePage(targetId) {
        // Remove # from targetId
        const pageId = targetId.substring(1);

        pageSections.forEach(section => {
            if (section.id === pageId) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Update active state for main nav links
        navLinks.forEach(link => {
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Close mobile menu after navigation
        if (navMenu.classList.contains('active')) {
             navMenu.classList.remove('active');
        }

        // Scroll to top of page
        window.scrollTo(0, 0);
    }

    // Add click listeners to main navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            setActivePage(targetId);
        });
    });

     // Add click listeners to other elements acting as nav links (e.g., buttons)
     navLinksJs.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            setActivePage(targetId);
        });
    });

    // --- Mobile Menu Toggle ---
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }


    // --- Homepage 'Start Creating' Button ---
    const startCreatingButtonHero = document.getElementById('start-creating-hero');
    const creativeInputHero = document.getElementById('creative-input-hero');
    if (startCreatingButtonHero && creativeInputHero) {
        startCreatingButtonHero.addEventListener('click', () => {
            const userIdea = creativeInputHero.value.trim();
            if (userIdea) {
                console.log("User Idea:", userIdea);
                // Optionally, pre-fill the studio input
                const creativeInputStudio = document.getElementById('creative-input-studio');
                if(creativeInputStudio) {
                    creativeInputStudio.value = userIdea;
                }
                // Navigate to the creation studio
                setActivePage('#creation-studio');
                 // Simulate moving to the first step if studio logic depends on it
                 setActiveStudioStep('step-input');
            } else {
                alert('请输入你的创意描述！');
            }
        });
    }

    // --- Creation Studio Logic (Placeholders & Step Navigation) ---
    const studioControlSteps = document.querySelectorAll('.studio-controls .control-step');
    const nextStepButtons = document.querySelectorAll('.studio-controls .btn-next-step');
    const backStepButtons = document.querySelectorAll('.studio-controls .btn-back');

    function setActiveStudioStep(stepId) {
        studioControlSteps.forEach(step => {
            if (step.id === stepId) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        console.log(`Studio Step Activated: ${stepId}`); // Debugging
    }

    // Initialize studio view (show first step)
    setActiveStudioStep('step-input');

    // Next Step Button Logic
    nextStepButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.control-step');
            let nextStepId = '';

            // Basic step flow simulation
            switch (currentStep.id) {
                case 'step-input':
                    nextStepId = 'step-refine';
                    console.log("Simulating AI Concept Generation...");
                    // TODO: Add API call simulation/loading state
                    document.getElementById('preview-3d').innerHTML = '<p> 模型</p><img src="placeholder-3d-model.png" alt="3D Model Placeholder" style="width:80%; margin:auto;">'; // Placeholder visual
                    break;
                case 'step-refine':
                    nextStepId = 'step-dfm';
                    console.log("Simulating DFM Analysis...");
                    simulateDfmAnalysis(); // Simulate DFM results
                    break;
                case 'step-dfm':
                    // Only proceed if DFM passed (check based on simulated results)
                    const dfmOkMsg = document.querySelector('#dfm-results .dfm-ok');
                    if (dfmOkMsg) {
                       nextStepId = 'step-material';
                       updatePriceEstimate(); // Initial price update
                    } else {
                       alert('请先解决 DFM 分析中的问题！');
                       return; // Don't proceed
                    }
                    break;
                 case 'step-material':
                    nextStepId = 'step-order';
                    console.log("Proceeding to order summary...");
                    // TODO: Populate order summary
                    break;
                default:
                    console.warn("Unknown step or final step");
                    return; // Do nothing if unknown or last step
            }

            if (nextStepId) {
                setActiveStudioStep(nextStepId);
            }
        });
    });

    // Back Step Button Logic
    backStepButtons.forEach(button => {
         button.addEventListener('click', () => {
            const currentStep = button.closest('.control-step');
            let prevStepId = '';

            switch (currentStep.id) {
                case 'step-refine': prevStepId = 'step-input'; break;
                case 'step-dfm': prevStepId = 'step-refine'; break;
                case 'step-material': prevStepId = 'step-dfm'; break;
                case 'step-order': prevStepId = 'step-material'; break;
                default: return; // Do nothing if first step
            }
             if (prevStepId) {
                setActiveStudioStep(prevStepId);
            }
         });
    });


    // Simulate DFM Analysis results
    function simulateDfmAnalysis() {
        const dfmResultsDiv = document.getElementById('dfm-results');
        const dfmFixButton = document.getElementById('dfm-fix-suggestion');
        const nextButton = document.querySelector('#step-dfm .btn-next-step'); // Button to proceed
        dfmResultsDiv.innerHTML = '<p>正在分析...</p>';
        nextButton.disabled = true; // Disable next step initially
        dfmFixButton.style.display = 'none';


        setTimeout(() => {
            // Randomly simulate success, warning, or error
            const outcome = Math.random();
            if (outcome < 0.4) { // Success
                dfmResultsDiv.innerHTML = '<p class="dfm-ok">✅ 分析通过！设计可制造性良好。</p>';
                 nextButton.disabled = false; // Enable next step
            } else if (outcome < 0.8) { // Warning
                dfmResultsDiv.innerHTML = `
                    <p class="dfm-issue-warning">⚠️ 警告：检测到潜在的薄壁区域 (模拟)。</p>
                    <p class="dfm-issue-warning">⚠️ 警告：部分悬空结构可能需要强力支撑 (模拟)。</p>
                `;
                dfmFixButton.style.display = 'inline-block';
                 nextButton.disabled = true; // Keep disabled until fixed or ignored
                 // Allow proceeding with warnings (optional): nextButton.disabled = false;

            } else { // Error
                 dfmResultsDiv.innerHTML = `
                    <p class="dfm-issue-error">❌ 错误：发现无法打印的倒扣结构 (模拟)。</p>
                    <p class="dfm-issue-error">❌ 错误：关键结构厚度不足 (模拟)。</p>
                    <p>请返回修改设计或描述。</p>
                 `;
                 dfmFixButton.style.display = 'none'; // No auto-fix for critical errors
                 nextButton.disabled = true;
            }
        }, 1500); // Simulate delay
    }

     // DFM Fix Suggestion Button
     const dfmFixButton = document.getElementById('dfm-fix-suggestion');
     if (dfmFixButton) {
         dfmFixButton.addEventListener('click', () => {
             console.log("Simulating DFM Auto-Fix...");
             const dfmResultsDiv = document.getElementById('dfm-results');
             const nextButton = document.querySelector('#step-dfm .btn-next-step');
             dfmResultsDiv.innerHTML = '<p>正在尝试自动修复... (模拟)</p>';
             dfmFixButton.style.display = 'none';

             setTimeout(() => {
                 dfmResultsDiv.innerHTML = '<p class="dfm-ok">✅ 自动修复完成 (模拟)。设计现在可以通过分析。</p>';
                 nextButton.disabled = false; // Enable next step after fix
             }, 1000);
         });
     }


    // --- Studio: Advanced Options Toggle ---
    const toggleAdvancedButton = document.querySelector('.toggle-advanced');
    const optionsContent = document.querySelector('.options-content');
    if (toggleAdvancedButton && optionsContent) {
        toggleAdvancedButton.addEventListener('click', () => {
            const isHidden = optionsContent.style.display === 'none';
            optionsContent.style.display = isHidden ? 'block' : 'none';
            toggleAdvancedButton.textContent = isHidden ? '高级选项 ▲' : '高级选项 ▼';
        });
    }

     // --- Studio: Material & Process Selection & Price Update ---
     const materialOptions = document.querySelectorAll('.material-option');
     const processCheckboxes = document.querySelectorAll('.process-selector input[type="checkbox"]');
     const priceSpan = document.getElementById('estimated-price');
     let basePrice = 5; // Simulated base price for the model itself
     let selectedMaterialPrice = 0;
     let selectedProcessesPrice = 0;

    function updatePriceEstimate() {
        selectedMaterialPrice = 0;
        const selectedMaterial = document.querySelector('.material-option.selected');
        if (selectedMaterial) {
            selectedMaterialPrice = parseFloat(selectedMaterial.dataset.price || 0);
        }

        selectedProcessesPrice = 0;
        processCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                // Extract price from label text (simple example)
                const labelText = checkbox.parentElement.textContent;
                const priceMatch = labelText.match(/\+¥(\d+)/);
                if (priceMatch) {
                    selectedProcessesPrice += parseFloat(priceMatch[1]);
                }
            }
        });

        const totalPrice = basePrice + selectedMaterialPrice + selectedProcessesPrice;
        priceSpan.textContent = `¥${totalPrice.toFixed(2)}`;
    }

     materialOptions.forEach(option => {
         option.addEventListener('click', () => {
             materialOptions.forEach(opt => opt.classList.remove('selected')); // Deselect others
             option.classList.add('selected');
             updatePriceEstimate();
         });
     });

     processCheckboxes.forEach(checkbox => {
         checkbox.addEventListener('change', updatePriceEstimate);
     });


    // --- Dashboard Tabs ---
    const tabLinks = document.querySelectorAll('.dashboard-tabs .tab-link');
    const tabContents = document.querySelectorAll('.dashboard-container .tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetTab = link.dataset.tab;

            // Update active link state
            tabLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show target tab content
            tabContents.forEach(content => {
                if (content.id === `tab-${targetTab}`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });

});