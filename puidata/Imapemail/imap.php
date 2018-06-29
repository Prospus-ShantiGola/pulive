<?php

/*
 * Imap
 * @author Abhijit <abhijagtap73@gmail.com> * 
 */
namespace Imapemail;
Class imap {

    private $mailbox;
    public $charset="US-ASCII";
    public $htmlmsg;
    public $plainmsg;
    public $attachments = array();
    public $fromaddress;
    public $toaddress;
    public $subject;
    public $Date;
    public $MailDate;
    public $savedir = __DIR__ . '/imap-dump/';
    
    public function __construct($authhost, $email, $emailPassword) {

        $stream = imap_open($authhost, $email, $emailPassword);
        if (FALSE === $stream) {
            throw new Exception('Connect failed: ' . imap_last_error());
        }
        $this->mailbox = $stream;
    }

    public function getMailbox() {
        return $this->mailbox;
    }
    
    public function getMailhtml() {
        //print_r($this);die;
        return $this;
    }

    /**
     * @param string $criteria
     * @param int $options
     * @param int $this->charset
     * @return IMAPMessage[]
     * @throws Exception
     */
    public function search($criteria, $options = NULL, $charset = NULL) {
        $mails = imap_search($this->mailbox, $criteria, $options, $this->charset);
        if (FALSE === $mails) {
            throw new Exception('Search failed: ' . imap_last_error());
        }

        foreach ($mails as $mail) {
            $attachments_temp = array();
            $this->getmsg($this->mailbox, $mail);
            foreach ($this->attachments as $key => $value) {
                $savepath = $this->savedir . $key;
                file_put_contents($savepath, $value);
                $attachments_temp[] = $savepath;
            }

            echo "--------------------------------------------" . "<br/>";
            echo "Email Charset :" . $this->charset . "<br/>";
            echo "Date :" . $this->Date . "<br/>";
            echo "MailDate :" . $this->MailDate . "<br/>";
            echo "From :" . $this->fromaddress . "<br/>";
            echo "To :" . $this->toaddress . "<br/>";
            echo "Subject :" . $this->subject . "<br/>";
            if ($this->plainmsg != "") {
                echo "Plain Message" . $this->charset . "<br/>";
            }
            if ($this->htmlmsg != "") {
                echo "HTML Message" . $this->htmlmsg . "<br/>";
            }
            if (!empty($this->attachments)) {
                echo "Attachments :";
                foreach ($this->attachments as $key => $value) {
                    echo $key . "<br/>";
                }
            }

            echo "--------------------------------------------" . "<br/>";
        }
    }

    public function getmsg($mbox, $mid) {
        // HEADER
        $this->htmlmsg = '';
        $mid = imap_msgno ($mbox , $mid);
        $h = imap_header($mbox, $mid);
        //print_r($h);die;
        // added code here to get date, from, to, cc, subject...
        $this->fromaddress = $h->fromaddress;
        $this->toaddress = $h->toaddress;
        $this->subject = $h->subject;
        $this->Date = $h->Date;
        $this->MailDate = $h->MailDate;

        // BODY
        $s = imap_fetchstructure($mbox, $mid);
        if (!$s->parts)  // simple
            $this->getpart($mbox, $mid, $s, 0);  // pass 0 as part-number
        else {  // multipart: cycle through each part
            foreach ($s->parts as $partno0 => $p)
                $this->getpart($mbox, $mid, $p, $partno0 + 1);
        }
    }

    function getpart($mbox, $mid, $p, $partno) {
        // $partno = '1', '2', '2.1', '2.1.3', etc for multipart, 0 if simple        
        // DECODE DATA
        $data = ($partno) ?
                imap_fetchbody($mbox, $mid, $partno) : // multipart
                imap_body($mbox, $mid);  // simple
        // Any part may be encoded, even plain text messages, so check everything.
        if ($p->encoding == 4)
            $data = quoted_printable_decode($data);
        elseif ($p->encoding == 3)
            $data = base64_decode($data);

        // PARAMETERS
        // get all parameters, like charset, filenames of attachments, etc.
        $params = array();
        if ($p->parameters)
            foreach ($p->parameters as $x)
                $params[strtolower($x->attribute)] = $x->value;
        if ($p->dparameters)
            foreach ($p->dparameters as $x)
                $params[strtolower($x->attribute)] = $x->value;

        // ATTACHMENT
        // Any part with a filename is an attachment,
        // so an attached text file (type 0) is not mistaken as the message.
        if ($params['filename'] || $params['name']) {
            // filename may be given as 'Filename' or 'Name' or both
            $filename = ($params['filename']) ? $params['filename'] : $params['name'];
            // filename may be encoded, so see imap_mime_header_decode()
            $this->attachments[$filename] = $data;  // this is a problem if two files have same name
        }

        // TEXT
        if ($p->type == 0 && $data) {
            // Messages may be split in different parts because of inline attachments,
            // so append parts together with blank row.
            if (strtolower($p->subtype) == 'plain')
                $this->plainmsg.= trim($data) . "\n\n";
            else
                    $this->htmlmsg.= $data . "<br><br>";
            $this->charset = $params['charset'];  // assume all parts are same charset
        }

        // EMBEDDED MESSAGE
        // Many bounce notifications embed the original message as type 2,
        // but AOL uses type 1 (multipart), which is not handled here.
        // There are no PHP functions to parse embedded messages,
        // so this just appends the raw source to the main message.
        elseif ($p->type == 2 && $data) {
            $this->plainmsg.= $data . "\n\n";
        }

        // SUBPART RECURSION
        if ($p->parts) {
            foreach ($p->parts as $partno0 => $p2)
                $this->getpart($mbox, $mid, $p2, $partno . '.' . ($partno0 + 1));  // 1.2, 1.2.1, etc.
        }
    }

    public function close() {
        imap_expunge($this->mailbox);
        imap_close($this->mailbox);
    }

}