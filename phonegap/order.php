<?php


/*$.getJSON('buy.php?' + buyURL, function(data) {

}*/

$form = <<<End
	<form method="post" action="purchase.php">
		<label>Name</label><input type="text" />
		<label>Address</label><input type="text" />
		<input type="submit" value="submit" />
	</form>
End;

echo json_encode($form);