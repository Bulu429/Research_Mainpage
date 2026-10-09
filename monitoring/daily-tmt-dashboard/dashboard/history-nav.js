(function () {
  function currentFileName() {
    var parts = window.location.pathname.split('/');
    return decodeURIComponent(parts[parts.length - 1] || 'latest.html');
  }

  function mountHistoryNavigation() {
    var history = Array.isArray(window.TMT_DASHBOARD_HISTORY)
      ? window.TMT_DASHBOARD_HISTORY
      : [];
    if (!history.length || document.querySelector('.tmt-history-nav')) return;

    var nav = document.createElement('div');
    nav.className = 'tmt-history-nav';

    var label = document.createElement('label');
    label.className = 'tmt-history-label';
    label.htmlFor = 'tmtHistorySelect';
    label.textContent = '历史看板';

    var select = document.createElement('select');
    select.id = 'tmtHistorySelect';
    select.className = 'tmt-history-select';
    select.setAttribute('aria-label', '选择历史看板日期');

    history.forEach(function (entry) {
      var option = document.createElement('option');
      option.value = entry.file;
      option.textContent = entry.date;
      select.appendChild(option);
    });

    var fileName = currentFileName();
    var currentEntry = history.find(function (entry) { return entry.file === fileName; });
    select.value = currentEntry ? currentEntry.file : history[0].file;
    select.addEventListener('change', function () {
      window.location.href = select.value;
    });

    var latest = document.createElement('a');
    latest.className = 'tmt-history-latest';
    latest.href = 'latest.html';
    latest.textContent = '回到最新版';
    latest.setAttribute('aria-label', '回到最新一期看板');

    nav.appendChild(label);
    nav.appendChild(select);
    nav.appendChild(latest);

    var header = document.querySelector('.header');
    if (header) header.appendChild(nav);
    else document.body.insertBefore(nav, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountHistoryNavigation);
  } else {
    mountHistoryNavigation();
  }
})();
