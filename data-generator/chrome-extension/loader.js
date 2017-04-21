/**
 * Created by kira on 4/17/17.
 */
/**
 * using this scripts to inject inorder to get all of tours from website travel.com.vn
 */

if ($) {
    let i = 0;
    let interval = setInterval(function () {
       if (i == 10) clearInterval(interval);

       getRecords();

    }, 5000);
}